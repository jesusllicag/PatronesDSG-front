import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptancePolicy, PolicyAcceptance } from '../../../models';

@Component({
  selector: 'app-policy-checkbox-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy-checkbox-list.component.html',
})
export class PolicyCheckboxListComponent {
  // Inputs
  policies = input.required<AcceptancePolicy[]>();
  acceptances = input<PolicyAcceptance[]>([]);
  disabled = input<boolean>(false);
  showRequiredBadge = input<boolean>(true);

  // Outputs
  acceptanceChange = output<PolicyAcceptance[]>();

  // Internal state
  protected readonly internalAcceptances = signal<Map<number, boolean>>(new Map());

  // Computed: merge input acceptances with internal state
  protected readonly mergedAcceptances = computed(() => {
    const map = new Map<number, boolean>();

    // Initialize from input acceptances
    for (const acceptance of this.acceptances()) {
      map.set(acceptance.policyId, acceptance.accepted);
    }

    // Override with internal changes
    for (const [policyId, accepted] of this.internalAcceptances()) {
      map.set(policyId, accepted);
    }

    return map;
  });

  // Computed: required policies
  protected readonly requiredPolicies = computed(() =>
    this.policies().filter((p) => p.required)
  );

  // Computed: optional policies
  protected readonly optionalPolicies = computed(() =>
    this.policies().filter((p) => !p.required)
  );

  // Computed: check if all required are accepted
  protected readonly allRequiredAccepted = computed(() => {
    const merged = this.mergedAcceptances();
    return this.requiredPolicies().every((p) => merged.get(p.id) === true);
  });

  // Computed: count of accepted policies
  protected readonly acceptedCount = computed(() => {
    const merged = this.mergedAcceptances();
    return this.policies().filter((p) => merged.get(p.id) === true).length;
  });

  // Computed: total policies count
  protected readonly totalCount = computed(() => this.policies().length);

  // Check if a specific policy is accepted
  isAccepted(policyId: number): boolean {
    return this.mergedAcceptances().get(policyId) === true;
  }

  // Toggle a policy acceptance
  togglePolicy(policy: AcceptancePolicy): void {
    if (this.disabled()) return;

    const currentValue = this.isAccepted(policy.id);
    const newValue = !currentValue;

    this.internalAcceptances.update((map) => {
      const newMap = new Map(map);
      newMap.set(policy.id, newValue);
      return newMap;
    });

    this.emitChanges();
  }

  // Accept all policies
  acceptAll(): void {
    if (this.disabled()) return;

    this.internalAcceptances.update(() => {
      const newMap = new Map<number, boolean>();
      for (const policy of this.policies()) {
        newMap.set(policy.id, true);
      }
      return newMap;
    });

    this.emitChanges();
  }

  // Clear all acceptances
  clearAll(): void {
    if (this.disabled()) return;

    this.internalAcceptances.update(() => {
      const newMap = new Map<number, boolean>();
      for (const policy of this.policies()) {
        newMap.set(policy.id, false);
      }
      return newMap;
    });

    this.emitChanges();
  }

  // Emit the current state as PolicyAcceptance array
  private emitChanges(): void {
    const merged = this.mergedAcceptances();
    const acceptances: PolicyAcceptance[] = this.policies().map((policy) => ({
      policyId: policy.id,
      accepted: merged.get(policy.id) === true,
      ...(merged.get(policy.id) === true && { acceptedAt: new Date() }),
    }));

    this.acceptanceChange.emit(acceptances);
  }
}
