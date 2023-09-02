import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DelegateFellow
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const delegateFellowABI = [
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [] },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'follower',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Followed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'follower',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Unfollowed',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'delegateAddress', internalType: 'address', type: 'address' },
    ],
    name: 'follow',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'follower', internalType: 'address', type: 'address' },
      { name: 'delegateAddress', internalType: 'address', type: 'address' },
    ],
    name: 'isFollowing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'delegateAddress', internalType: 'address', type: 'address' },
    ],
    name: 'unfollow',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link delegateFellowABI}__.
 */
export function useDelegateFellowRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof delegateFellowABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof delegateFellowABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: delegateFellowABI,
    ...config,
  } as UseContractReadConfig<
    typeof delegateFellowABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link delegateFellowABI}__ and `functionName` set to `"isFollowing"`.
 */
export function useDelegateFellowIsFollowing<
  TFunctionName extends 'isFollowing',
  TSelectData = ReadContractResult<typeof delegateFellowABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof delegateFellowABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: delegateFellowABI,
    functionName: 'isFollowing',
    ...config,
  } as UseContractReadConfig<
    typeof delegateFellowABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link delegateFellowABI}__ and `functionName` set to `"owner"`.
 */
export function useDelegateFellowOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof delegateFellowABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof delegateFellowABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: delegateFellowABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
    typeof delegateFellowABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link delegateFellowABI}__.
 */
export function useDelegateFellowWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof delegateFellowABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof delegateFellowABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof delegateFellowABI, TFunctionName, TMode>({
    abi: delegateFellowABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link delegateFellowABI}__ and `functionName` set to `"follow"`.
 */
export function useDelegateFellowFollow<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof delegateFellowABI,
          'follow'
        >['request']['abi'],
        'follow',
        TMode
      > & { functionName?: 'follow' }
    : UseContractWriteConfig<typeof delegateFellowABI, 'follow', TMode> & {
        abi?: never
        functionName?: 'follow'
      } = {} as any,
) {
  return useContractWrite<typeof delegateFellowABI, 'follow', TMode>({
    abi: delegateFellowABI,
    functionName: 'follow',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link delegateFellowABI}__ and `functionName` set to `"unfollow"`.
 */
export function useDelegateFellowUnfollow<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof delegateFellowABI,
          'unfollow'
        >['request']['abi'],
        'unfollow',
        TMode
      > & { functionName?: 'unfollow' }
    : UseContractWriteConfig<typeof delegateFellowABI, 'unfollow', TMode> & {
        abi?: never
        functionName?: 'unfollow'
      } = {} as any,
) {
  return useContractWrite<typeof delegateFellowABI, 'unfollow', TMode>({
    abi: delegateFellowABI,
    functionName: 'unfollow',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link delegateFellowABI}__.
 */
export function usePrepareDelegateFellowWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof delegateFellowABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: delegateFellowABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof delegateFellowABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link delegateFellowABI}__ and `functionName` set to `"follow"`.
 */
export function usePrepareDelegateFellowFollow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof delegateFellowABI, 'follow'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: delegateFellowABI,
    functionName: 'follow',
    ...config,
  } as UsePrepareContractWriteConfig<typeof delegateFellowABI, 'follow'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link delegateFellowABI}__ and `functionName` set to `"unfollow"`.
 */
export function usePrepareDelegateFellowUnfollow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof delegateFellowABI, 'unfollow'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: delegateFellowABI,
    functionName: 'unfollow',
    ...config,
  } as UsePrepareContractWriteConfig<typeof delegateFellowABI, 'unfollow'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link delegateFellowABI}__.
 */
export function useDelegateFellowEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof delegateFellowABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: delegateFellowABI,
    ...config,
  } as UseContractEventConfig<typeof delegateFellowABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link delegateFellowABI}__ and `eventName` set to `"Followed"`.
 */
export function useDelegateFellowFollowedEvent(
  config: Omit<
    UseContractEventConfig<typeof delegateFellowABI, 'Followed'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: delegateFellowABI,
    eventName: 'Followed',
    ...config,
  } as UseContractEventConfig<typeof delegateFellowABI, 'Followed'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link delegateFellowABI}__ and `eventName` set to `"Unfollowed"`.
 */
export function useDelegateFellowUnfollowedEvent(
  config: Omit<
    UseContractEventConfig<typeof delegateFellowABI, 'Unfollowed'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: delegateFellowABI,
    eventName: 'Unfollowed',
    ...config,
  } as UseContractEventConfig<typeof delegateFellowABI, 'Unfollowed'>)
}
